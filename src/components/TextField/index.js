import {
    TextField,
    useTheme,
    MenuItem
} from "@mui/material";
import { Field } from "formik";
import LoginCss from '../../css/LoginCss';

export const renderTextFieldSmall =
    (
        name,
        label,
        type = "text",
        options = null,
        isPassword = false,
        min = null,
        onChange
    ) => {
        const theme = useTheme();
        const styles = LoginCss(theme);
        return (
            <Field name={name}>
                {({ field, meta, form: { setFieldValue } }) => (
                    <TextField
                        sx={styles.StyledTextField}
                        {...field}
                        label={label}
                        type={
                            isPassword
                                ? name === "password"
                                    ? showPassword
                                        ? "text"
                                        : "password"
                                    : showConfirmPassword
                                        ? "text"
                                        : "password"
                                : type
                        }
                        size="small"
                        fullWidth
                        // required
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        select={!!options}
                        // InputLabelProps={type === "date" ? { shrink: true } : {}}
                        InputLabelProps={{
                            style: {
                                fontSize: "14px",
                                fontFamily: "Poppins",
                                fontWeight: "400",
                                color: "#3D3D4E",
                            }, // Smaller label font size
                            shrink: type === "date" ? true : undefined,
                        }}
                        InputProps={{
                            ...(isPassword
                                ? {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    name === "password"
                                                        ? handleClickShowPassword
                                                        : handleClickShowConfirmPassword
                                                }
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {name === "password" ? (
                                                    showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )
                                                ) : showConfirmPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                                : {}),
                            ...(type === "number" && min !== null
                                ? {
                                    inputProps: { min: min },
                                }
                                : {}),
                        }}
                        onChange={onChange ? onChange:
                            (e) => {
                            const value = e.target.value;
                            if (type === "number" && min !== null) {
                                if (value === "" || parseInt(value) < min) {
                                    setFieldValue(name, min.toString());
                                } else {
                                    setFieldValue(name, value);
                                }
                            } else {
                                field.onChange(e);
                            }
                        }}
                    >
                        {options &&
                            options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                    </TextField>
                )}
            </Field>
        )
    }

export const renderTextFieldLarge =
    (
        name,
        label,
        type = "text",
        options = null,
        isPassword = false,
        min = null
    ) => {
        const theme = useTheme();
        const styles = LoginCss(theme);
        return (
            <Field name={name}>
                {({ field, meta, form: { setFieldValue } }) => (
                    <TextField
                        sx={styles.StyledTextField}
                        {...field}
                        label={label}
                        type={
                            isPassword
                                ? name === "password"
                                    ? showPassword
                                        ? "text"
                                        : "password"
                                    : showConfirmPassword
                                        ? "text"
                                        : "password"
                                : type
                        }
                        size="large"
                        fullWidth
                        // required
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        select={!!options}
                        // InputLabelProps={type === "date" ? { shrink: true } : {}}
                        InputLabelProps={{
                            style: {
                                fontSize: "18px",
                                fontFamily: "Poppins",
                                fontWeight: "400",
                                color: "#3D3D4E",
                            }, // Smaller label font size
                            shrink: type === "date" ? true : undefined,
                        }}
                        InputProps={{
                            ...(isPassword
                                ? {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    name === "password"
                                                        ? handleClickShowPassword
                                                        : handleClickShowConfirmPassword
                                                }
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {name === "password" ? (
                                                    showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )
                                                ) : showConfirmPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                                : {}),
                            ...(type === "number" && min !== null
                                ? {
                                    inputProps: { min: min },
                                }
                                : {}),
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (type === "number" && min !== null) {
                                if (value === "" || parseInt(value) < min) {
                                    setFieldValue(name, min.toString());
                                } else {
                                    setFieldValue(name, value);
                                }
                            } else {
                                field.onChange(e);
                            }
                        }}
                    >
                        {options &&
                            options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                    </TextField>
                )}
            </Field>
        )
    }