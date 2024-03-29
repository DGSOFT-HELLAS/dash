
import React from "react";
import { Password } from 'primereact/password';
import { InputContainer } from "./PrimeInput";
import { Controller} from 'react-hook-form';
import { classNames } from 'primereact/utils';



export function PrimeInputPass({ name, mb, mt, control,error, label,  }) {

    return (
        <InputContainer mb={mb} mt={mt} error={error}>
            <Controller
                    name={name}
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} >
                                {label}
                            </label>
                            <Password 
                                feedback={false}
                                toggleMask
                                id={field.name} 
                                value={field.value}
                                inputRef={field.ref} 
                                style={{ width: '100%' }}
                                onChange={(e) => field.onChange(e.target.value)}
                                className={classNames({ 'p-invalid': fieldState.error })}
                                 />
                        </>
                    )}
                />

        </ InputContainer >
    )
}
