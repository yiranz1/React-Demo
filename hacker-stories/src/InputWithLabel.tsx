import * as React from "react";

type InputWithLabelProps = {
    id: string,
    value: string,
    type?: string,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    children: React.ReactNode,
}

const InputWithLabel = ({
                            id,
                            children,
                            type = 'text',
                            value,
                            onInputChange
                        }: InputWithLabelProps) => {
    return (
        <div>
            <label htmlFor={id} className="label">{children}</label>
            <input id={id} type={type} value={value} onChange={onInputChange} className="input" />
        </div>
    );
}

export { InputWithLabel };