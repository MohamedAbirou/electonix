import Container from "@/components/container";
import FormWrapper from "@/components/form-wrapper";
import { LoginForm } from "./_components/login-form";
import { getCurrentUser } from "@/actions/getCurrentUser";

const LoginPage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <Container>
      <FormWrapper>
        <LoginForm currentUser={currentUser} />
      </FormWrapper>
    </Container>
  );
};

export default LoginPage;
