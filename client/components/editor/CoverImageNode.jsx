import ImagePicker from "@/components/ImagePicker";

export default function CoverImage({
    coverImage,
    setCoverImage,
    setCoverError,
    coverError = "",
}) {
    return (
        <div style={{ padding: "3rem 3rem 0" }}>
            <ImagePicker
                image={coverImage}
                setImage={setCoverImage}
                aspectRatio="191/100"
                label="إضافة صورة غلاف"
                changeLabel="تغيير صورة الغلاف"
                error={coverError}
                setError={setCoverError}
            />
        </div>
    );
}
