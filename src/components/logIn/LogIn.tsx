import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {useFormik} from 'formik'
import {useAppDispatch} from '../../state/store'
import {logInTC} from '../../state/reducers/auth-reducer'
import {useSelector} from 'react-redux'
import {isLoggedInSelector} from '../../state/selectors/auth-selector'
import {Navigate} from 'react-router-dom'

// Типы для валидации ошибок
type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}


export const LogIn = () => {
    // Получили isLoggedIn из state используя хук - useSelector и selector - isLoggedInSelector
    const isLoggedIn = useSelector(isLoggedInSelector)

    // useAppDispatch - это кастомный хук, который уже протипизирован и лежит в store
    const dispatch = useAppDispatch()


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: values => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Email Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Password Required'
            } else if (values.password.length < 6) {
                errors.password = 'Must be 6 characters or more'
            }
            return errors
        },
        onSubmit: values => {
            // Проверка для очистки формы
            values.rememberMe
                ? dispatch(logInTC(values))
                : dispatch(logInTC(values)).then(() => formik.resetForm())
        }
    })


    // Redirect в случае логинизации
    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }


    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered
                                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField label="Email"
                                       type={'email'}
                                       margin="normal"
                                       {...formik.getFieldProps('email')}
                                       onBlur={formik.handleBlur}/>
                            {formik.touched.email && formik.errors.email
                                ? <div>{formik.errors.email}</div>
                                : null}

                            <TextField label="Password"
                                       type="password"
                                       margin="normal"
                                       {...formik.getFieldProps('password')}
                                       onBlur={formik.handleBlur}/>
                            {formik.touched.password && formik.errors.password
                                ? <div>{formik.errors.password}</div>
                                : null}

                            <FormControlLabel label={'Remember me'}
                                              control={<Checkbox
                                                  onChange={formik.handleChange}
                                                  checked={formik.values.rememberMe}
                                                  name="rememberMe"/>}/>

                            <Button type={'submit'} variant={'contained'} color={'primary'}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    )
}