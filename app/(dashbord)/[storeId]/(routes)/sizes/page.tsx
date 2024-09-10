import { format } from 'date-fns';

import prismadb from "@/lib/prismadb";
import { SizesClient } from './components/client';
import { SizesColumn } from "./components/columns";


const SizePage = async ({
  params
}: {
  params : {sizeId: string }
}) => {
  const sizes = await prismadb.size.findMany( {
    where : {
      storeId: params.sizeId
    }, 
    orderBy : {
      createAt: 'desc'
    }
  });

  const formatteSizes: SizesColumn[]= sizes.map((item) => ({
    id:item.id,
    name: item.name,
    value: item.value,
    createAt: format(item.createAt, "MMMM do,yyyy")
  }))



return(
  <div className="flex-col">
 <div className="flex-1 space-y-4 p-8 pt-6"></div>
    <SizesClient data={formatteSizes}/>
  </div>
)

}

export default SizePage;