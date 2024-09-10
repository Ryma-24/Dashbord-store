import prismadb from "@/lib/prismadb";
import { SizesForm } from "./components/size-form";



const SizesPage= async ({
  params
}: {
  params: {sizeId: string}
}) => {

const  size = await prismadb.size.findUnique({
  where: {
    id: params.sizeId
  }
});

return(
 <div className="flex-col">
<div className="flex-1 space-y-4 p-8  " >
<SizesForm initialData={size}></SizesForm>
</div>
 </div>
)
}

export default SizesPage