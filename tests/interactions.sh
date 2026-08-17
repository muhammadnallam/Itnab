#!/usr/bin/env bash
# Smoke test for the interactions API module (follow, likes, save, share, view).
# Usage: BASE=http://localhost:3001/api tests/interactions.sh
set -uo pipefail

BASE="${BASE:-http://localhost:3001/api}"
AUTH_BASE="${BASE}/auth"
AUTHOR_ID="${AUTHOR_ID:-c142d8ed-997b-468e-bdd6-46c337b2a98f}" # admin@itnab.com

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
CK_A="$TMP/ckA.txt"
CK_B="$TMP/ckB.txt"

PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); }
bad() { FAIL=$((FAIL + 1)); echo "  FAIL: $1"; }

expect_status() {
    local desc="$1" expected="$2" actual="$3"
    if [ "$actual" = "$expected" ]; then ok; else bad "$desc (expected $expected, got $actual)"; fi
}

signup_or_signin() {
    local email="$1" pass="$2" jar="$3"
    curl -s -c "$jar" -X POST "$AUTH_BASE/sign-up/email" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"Smoke\",\"email\":\"$email\",\"password\":\"$pass\"}" >/dev/null
    if ! grep -q "better-auth.session_token" "$jar" 2>/dev/null; then
        curl -s -c "$jar" -X POST "$AUTH_BASE/sign-in/email" \
            -H "Content-Type: application/json" \
            -d "{\"email\":\"$email\",\"password\":\"$pass\"}" >/dev/null
    fi
}

json_get() { python3 -c "import sys,json;d=json.load(sys.stdin);print(d$1)"; }

echo "== Setup =="
signup_or_signin "testa@itnab.dev" "password123" "$CK_A"
signup_or_signin "testb@itnab.dev" "password123" "$CK_B"

A_ID=$(curl -s -b "$CK_A" "$AUTH_BASE/get-session" | json_get "['user']['id']")
A_USERNAME=$(curl -s -b "$CK_A" "$AUTH_BASE/get-session" | json_get "['user']['username']")
echo "  A id=$A_ID username=$A_USERNAME"

# Create a fresh article as A so A is the author (enables the self-view test).
ARTICLE_JSON=$(python3 - "$A_ID" <<'PY'
import json, sys
seoTitle = "عنوان تجريبي لمقال جديد تم إنشاؤه لاختبار التفاعلات"
seoDesc = "هذا وصف تجريبي لمقال اختباري أنشئ لغرض التحقق من عمل نظام التفاعلات مثل الإعجابات والحفظ والمشاركة والمشاهدات على المنصة"
payload = {
    "content": {
        "type": "doc",
        "content": [
            {"type": "articleTitle", "content": [{"type": "text", "text": "عنوان تجريبي"}]},
            {"type": "articleDescription", "content": [{"type": "text", "text": "وصف تجريبي للمقال"}]},
            {"type": "paragraph", "content": [{"type": "text", "text": "نص تجريبي."}]},
        ],
    },
    "data": {
        "seoTitle": seoTitle,
        "seoDescription": seoDesc,
        "tag": "الاقتصاد",
        "coverImage": "https://res.cloudinary.com/ewgnp8vu/image/upload/v1786685974/itnab/article-covers/xqdijzzdscenk1kbip7z.jpg",
        "wordCount": 500,
        "sendEmail": False,
    },
}
print(json.dumps(payload, ensure_ascii=False))
PY
)
SLUG=$(curl -s -b "$CK_A" -X POST "$BASE/article/create" -H "Content-Type: application/json" -d "$ARTICLE_JSON" | json_get "['slug']")
[ -n "$SLUG" ] && [ "$SLUG" != "null" ] && ok || bad "article creation"
ART_ID=$(curl -s "$BASE/article/$SLUG/read" | json_get "['id']")
[ -n "$ART_ID" ] && [ "$ART_ID" != "null" ] && ok || bad "resolve article id"
echo "  article slug=$SLUG id=$ART_ID"

echo "== Follow =="
# A follows admin (author) — idempotent
code=$(curl -s -o "$TMP/f1.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/users/$AUTHOR_ID/follow")
expect_status "A follows author" 200 "$code"
grep -q '"isFollowing":true' "$TMP/f1.json" && ok || bad "follow isFollowing true"
code=$(curl -s -o "$TMP/f2.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/users/$AUTHOR_ID/follow")
expect_status "repeat follow idempotent" 200 "$code"
cmp -s "$TMP/f1.json" "$TMP/f2.json" && ok || bad "repeat follow unchanged"

# get states
code=$(curl -s -o "$TMP/f3.json" -w "%{http_code}" -b "$CK_A" "$BASE/users/$AUTHOR_ID/follow")
expect_status "get follow (authed)" 200 "$code"
grep -q '"isFollowing":true' "$TMP/f3.json" && ok || bad "get isFollowing true"
code=$(curl -s -o "$TMP/f4.json" -w "%{http_code}" "$BASE/users/$AUTHOR_ID/follow")
expect_status "get follow (anon)" 200 "$code"
grep -q '"isFollowing":false' "$TMP/f4.json" && ok || bad "anon isFollowing false"

# errors
code=$(curl -s -o "$TMP/f5.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/users/$A_ID/follow")
expect_status "self-follow -> 400" 400 "$code"
code=$(curl -s -o "$TMP/f6.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/users/00000000-0000-0000-0000-000000000000/follow")
expect_status "follow missing user -> 404" 404 "$code"
grep -q '"error"' "$TMP/f6.json" && ok || bad "404 error envelope"

# unfollow
code=$(curl -s -o "$TMP/f7.json" -w "%{http_code}" -b "$CK_A" -X DELETE "$BASE/users/$AUTHOR_ID/follow")
expect_status "unfollow" 200 "$code"
grep -q '"isFollowing":false' "$TMP/f7.json" && ok || bad "unfollow isFollowing false"

echo "== Likes =="
code=$(curl -s -o "$TMP/l0.json" -w "%{http_code}" "$BASE/articles/$ART_ID/likes")
expect_status "anon get likes" 200 "$code"
grep -q '"type":null' "$TMP/l0.json" && ok || bad "anon type null"

code=$(curl -s -o "$TMP/l1.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/articles/$ART_ID/likes" -H "Content-Type: application/json" -d '{"type":"LIKE"}')
expect_status "A likes own article (allowed)" 200 "$code"
grep -q '"type":"LIKE"' "$TMP/l1.json" && ok || bad "like type LIKE"
code=$(curl -s -o "$TMP/l2.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/articles/$ART_ID/likes" -H "Content-Type: application/json" -d '{"type":"LIKE"}')
expect_status "repeat like" 200 "$code"
cmp -s "$TMP/l1.json" "$TMP/l2.json" && ok || bad "repeat like unchanged"

code=$(curl -s -o "$TMP/l3.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/articles/$ART_ID/likes" -H "Content-Type: application/json" -d '{"type":"DISLIKE"}')
expect_status "switch to dislike" 200 "$code"
grep -q '"type":"DISLIKE"' "$TMP/l3.json" && ok || bad "dislike type DISLIKE"
grep -q '"likeCount":0' "$TMP/l3.json" && grep -q '"dislikeCount":1' "$TMP/l3.json" && ok || bad "swap counters"

code=$(curl -s -o "$TMP/l4.json" -w "%{http_code}" -b "$CK_A" -X DELETE "$BASE/articles/$ART_ID/likes")
expect_status "delete reaction" 200 "$code"
grep -q '"type":null' "$TMP/l4.json" && ok || bad "deleted type null"

code=$(curl -s -o "$TMP/l5.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/articles/$ART_ID/likes" -H "Content-Type: application/json" -d '{"type":"MEH"}')
expect_status "invalid type -> 400" 400 "$code"
code=$(curl -s -o "$TMP/l6.json" -w "%{http_code}" -b "$CK_A" "$BASE/articles/00000000-0000-0000-0000-000000000000/likes")
expect_status "likes on missing article -> 404" 404 "$code"

echo "== Save =="
code=$(curl -s -o "$TMP/s0.json" -w "%{http_code}" "$BASE/articles/$ART_ID/save")
expect_status "anon save state" 200 "$code"
grep -q '"saved":false' "$TMP/s0.json" && ok || bad "anon saved false"

code=$(curl -s -o "$TMP/s1.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/articles/$ART_ID/save" -H "Content-Type: application/json" -d '{}')
expect_status "A saves (default list)" 200 "$code"
grep -q '"saved":true' "$TMP/s1.json" && ok || bad "save saved true"

code=$(curl -s -o "$TMP/s2.json" -w "%{http_code}" -b "$CK_A" "$BASE/articles/$ART_ID/save")
expect_status "get save state" 200 "$code"
grep -q '"saved":true' "$TMP/s2.json" && ok || bad "get saved true"
LIST_IDS=$(python3 -c "import sys,json;print(len(json.load(sys.stdin)['listIds']))" < "$TMP/s2.json")
[ "$LIST_IDS" = "1" ] && ok || bad "default list auto-created"

DEFAULT_NAME=$(curl -s "$BASE/feed/lists?author=$A_ID" | json_get "['lists'][0]['name']")
[ "$DEFAULT_NAME" = "قراءة لاحقًا" ] && ok || bad "default list name (got: $DEFAULT_NAME)"

# A saves to B's list -> 403 (not 404)
B_LIST=$(curl -s -b "$CK_B" -X PUT "$BASE/articles/$ART_ID/save" -H "Content-Type: application/json" -d '{}' >/dev/null; \
    curl -s -b "$CK_B" "$BASE/articles/$ART_ID/save" | json_get "['listIds'][0]")
code=$(curl -s -o "$TMP/s3.json" -w "%{http_code}" -b "$CK_A" -X PUT "$BASE/articles/$ART_ID/save" -H "Content-Type: application/json" -d "{\"listId\":\"$B_LIST\"}")
expect_status "save to foreign list -> 403" 403 "$code"
grep -q '"error"' "$TMP/s3.json" && ok || bad "403 error envelope"

code=$(curl -s -o "$TMP/s4.json" -w "%{http_code}" -b "$CK_A" -X DELETE "$BASE/articles/$ART_ID/save" -H "Content-Type: application/json" -d '{}')
expect_status "unsave" 200 "$code"
grep -q '"saved":false' "$TMP/s4.json" && ok || bad "unsave saved false"

echo "== Share =="
code=$(curl -s -o "$TMP/h1.json" -w "%{http_code}" -X POST "$BASE/articles/$ART_ID/share" -H "Content-Type: application/json" -d '{"platform":"x"}')
expect_status "anon share 1" 200 "$code"
S1=$(json_get "['shareCount']" < "$TMP/h1.json")
code=$(curl -s -o "$TMP/h2.json" -w "%{http_code}" -X POST "$BASE/articles/$ART_ID/share" -H "Content-Type: application/json" -d '{"platform":"telegram"}')
expect_status "anon share 2" 200 "$code"
S2=$(json_get "['shareCount']" < "$TMP/h2.json")
[ "$S2" -gt "$S1" ] && ok || bad "shareCount incremented ($S1 -> $S2)"
code=$(curl -s -o "$TMP/h3.json" -w "%{http_code}" -X POST "$BASE/articles/$ART_ID/share" -H "Content-Type: application/json" -d '{"platform":"pinterest"}')
expect_status "invalid platform -> 400" 400 "$code"

echo "== View =="
code=$(curl -s -o "$TMP/v1.json" -w "%{http_code}" -X POST "$BASE/articles/$ART_ID/view" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148 Safari/604.1")
expect_status "anon view 1" 200 "$code"
V1=$(json_get "['viewCount']" < "$TMP/v1.json")
code=$(curl -s -o "$TMP/v2.json" -w "%{http_code}" -X POST "$BASE/articles/$ART_ID/view" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148 Safari/604.1")
expect_status "anon view 2 (same ip)" 200 "$code"
V2=$(json_get "['viewCount']" < "$TMP/v2.json")
[ "$V2" = "$V1" ] && ok || bad "anon view deduped ($V1 -> $V2)"

code=$(curl -s -o "$TMP/v3.json" -w "%{http_code}" -b "$CK_A" -X POST "$BASE/articles/$ART_ID/view" -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0")
expect_status "author self-view" 200 "$code"
V3=$(json_get "['viewCount']" < "$TMP/v3.json")
[ "$V3" = "$V2" ] && ok || bad "author self-view excluded ($V2 -> $V3)"

code=$(curl -s -o "$TMP/v4.json" -w "%{http_code}" -X POST "$BASE/articles/00000000-0000-0000-0000-000000000000/view")
expect_status "view missing article -> 404" 404 "$code"

echo
echo "== Results: $PASS passed, $FAIL failed =="
[ "$FAIL" = "0" ]