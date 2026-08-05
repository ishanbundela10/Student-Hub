import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
    message?: string;
}

export default function FormError({ message }: FormErrorProps) {
    if (!message) return null;

    return (
        <div className="mt-2 flex items-center gap-1 text-red-600 text-sm animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}