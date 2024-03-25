import Container from "@/components/container";
import { CartClient } from "./_components/cart-client";
import { getCurrentUser } from "@/actions/getCurrentUser";

const CartPage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="pt-8">
      <Container>
        <CartClient currentUser={currentUser} />
      </Container>
    </div>
  );
};

export default CartPage;
