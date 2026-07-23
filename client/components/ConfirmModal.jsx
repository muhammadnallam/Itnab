import Modal from "@/components/Modal";
import Button from "./Button";

export default function ConfirmModal({
    icon: Icon,
    color,
    icoBackground,
    title,
    description,
    buttonText,
    onCancel,
    onConfirm,
    isOpen,
}) {
    return (
        <Modal open={isOpen} onClose={onCancel} style={{ textAlign: "center" }}>
            {/* Icon circle */}
            <div
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: icoBackground,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                }}
            >
                {Icon && <Icon size={26} color={color} strokeWidth={2.25} />}
            </div>

            {/* Title */}
            <h2
                style={{
                    margin: "0 0 8px",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1f2430",
                }}
            >
                {title}
            </h2>

            {/* Description */}
            <p
                style={{
                    margin: "0 0 24px",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#8a8f9a",
                    lineHeight: 1.6,
                }}
            >
                {description}
            </p>

            {/* Actions — deliberately kept LTR so Cancel stays left and the
            primary action stays right, matching the original layout. */}
            <div
                dir="ltr"
                style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                }}
            >
                <Button
                    onClick={onCancel}
                    variant="secondary"
                    style={{ width: "50%" }}
                >
                    إلغاء
                </Button>
                <Button
                    onClick={onConfirm}
                    style={{ background: color, width: "50%" }}
                >
                    {buttonText}
                </Button>
            </div>
        </Modal>
    );
}
