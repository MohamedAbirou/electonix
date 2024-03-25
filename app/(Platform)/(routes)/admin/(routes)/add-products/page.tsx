import Container from "@/components/container";
import FormWrapper from "@/components/form-wrapper";
import { AddProductForm } from "./_components/add-product-form";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { NullData } from "@/components/NullData";

const AddProducts = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  return (
    <div className="p-8">
      <Container>
        <FormWrapper className="pt-3">
          <AddProductForm />
        </FormWrapper>
      </Container>
    </div>
  );
};

export default AddProducts;
