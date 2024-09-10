"use client"


import { useStoreModal } from "@/hook/use-store-modal";
import { Modal } from "../ui/modal";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";



const formSchema = z.object({
  name: z.string().min(1),
})


export const StoreModal = () => {
const storeModal = useStoreModal()

const [loading, setLoading] = useState(false)

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues:{
    name:"",
  }
});

const onSubmit = async (values: z.infer<typeof formSchema>) => {
try {
  setLoading(true)


  const response = await axios.post('/api/stores', values)

 window.location.assign(`/${response.data.id}`)

}catch( error) {
  toast.error("Un problème est survenu")
}finally {
  setLoading(false)
}
}

return(
 <Modal 
 title="Creation du store"
 description=" Ajout du nouveau store pour geré les produits et les categories"
 isOpen={storeModal.isOpen}
 onClose={storeModal.onClose}>

  <div>
    <div className="space-y-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
          control={form.control}
          name="name"
          render= {({ field}) =>(
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
             <Input disabled={loading} placeholder="Site-co" {...field}/>
            </FormControl> 
            <FormMessage/>
          </FormItem>
          )}
          />
          <div className="pt-6 space-x-2 items-center justify-end w-full">
           <Button
           disabled={loading}
           variant="outline"
            onClick={storeModal.onClose}>
            Annuler
            </Button>
           <Button disabled={loading} type="submit">Continuer</Button>
          </div>
         </form>
      </Form>
    </div>
  </div>
 </Modal>
 );
}
