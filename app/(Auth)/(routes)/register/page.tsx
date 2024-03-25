import Container from "@/components/container";
import FormWrapper from "@/components/form-wrapper";
import { RegisterForm } from "./_components/register-form";
import { getCurrentUser } from "@/actions/getCurrentUser";

const RegisterPage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <Container>
      <FormWrapper>
        <RegisterForm currentUser={currentUser} />
      </FormWrapper>
    </Container>
  );
};

export default RegisterPage;
