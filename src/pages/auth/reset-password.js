import React from 'react'
import LoginLayout from '@/layouts/Auth/loginLayout'
import { InputDiv } from '@/components/Forms/FormInput'
import { Btn } from '@/components/Buttons/styles'
import styled, { useTheme } from 'styled-components'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { InputStyled } from '@/components/Forms/FormInput'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
	email: yup.string().required('Συμπληρώστε το email').email('Λάθος format email'),
});

const ResetPassword = () => {
  const [submit, setSubmit] = React.useState(false)
  const [email, setEmail] = React.useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
		resolver: yupResolver(schema),
	});

  const ResetPassword = async (event , data) => {
    setSubmit(prev => !prev)
  } 

  return (
    <LoginLayout>
      <Container className='box'>
        {!submit ? (
          <>
            <Header>
              Εισάγετε την διεύθυνση email σας και θα σας στείλουμε έναν σύνδεσμο για την επαναφορά του κωδικού πρόσβασης.
            </Header>
				    <form noValidate onSubmit={handleSubmit(ResetPassword)}>

            </form>
							<InputStyled
								label="Email"
								name="email"
								type="email"
								register={register}
								error={errors.email}
							/>
            <Btn >Αποστολή συνδέσμου στο Email</Btn>
          </>
        ) : (
          <SuccessMessage />

        )}
      </Container>
    </LoginLayout>

  )
}

const SuccessMessage = () => {
  const theme = useTheme();
  return (
    <>
      <CheckCircleOutlineRoundedIcon sx={{ fontSize: '35px', color: `${theme.palette.primary.main}`, mb: '10px' }} />
      <h3 className='mb10'>
        Το email στάλθηκε
      </h3>
      <p>Ελέγξτε το email σας και πατήστε τον σύνδεσμο αλλαγής κωδικού</p>
    </>
  )
}

const Header = styled.h1`
  font-size: 0.9em;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 30px;
`


const Container = styled.div`
  max-width: 500px;
  border-top: ;
`
export default ResetPassword