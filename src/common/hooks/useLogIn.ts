import {FormikHelpers, useFormik} from 'formik'
import {LoginParamsType} from 'features/auth/api/auth-api'
import {ResponseType} from 'features/toDoLists/api/todolist-api'
import {useAppDispatch} from 'app/model/store'
import {authThunks} from 'features/auth/model/auth-reducer'

// Типы для валидации ошибок
type FormikErrorType = Partial<Omit<LoginParamsType, 'captcha'>>;


export const useLogIn = () => {

    // useAppDispatch - это кастомный хук, который уже типизирован и лежит в store
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
            captcha: ''
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Email Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Password Required'
            } else if (values.password.length < 4) {
                errors.password = 'Must be 4 characters or more'
            }
            return errors
        },
        onSubmit: (values: LoginParamsType, formikHelpers: FormikHelpers<LoginParamsType>) => {
            // Ловим ошибки, которые будут в случае неудачи

            dispatch(authThunks.logIn(values))
                // Необходимо, чтоб попасть в catch
                .unwrap()
                .then(() => {
                })
                .catch((data: ResponseType) => {
                    const {fieldsErrors} = data
                    fieldsErrors?.forEach(el => {
                        formikHelpers.setFieldError(el.field, el.error)
                    })
                })
        }
    })

    return {formik}
}