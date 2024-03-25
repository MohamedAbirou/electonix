import Container from "@/components/container";
import FormWrapper from "@/components/form-wrapper";
import { CheckoutClient } from "./_components/checkout-client";

const Checkout = () => {
  return (
    <div className="p-8">
      <Container>
        <FormWrapper>
          <CheckoutClient />
        </FormWrapper>
      </Container>
    </div>
  );
};

export default Checkout;
