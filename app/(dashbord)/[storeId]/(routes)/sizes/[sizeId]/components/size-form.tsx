"use client";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";



const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
});

type SizesFormValues = z.infer<typeof formSchema>

interface SizesFormProps {
  initialData: Size | null
}


export const SizesForm:React.FC<SizesFormProps> = ({
  initialData
}) => {

  const params= useParams();
  const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Editer le size' : "Crée le size"
    const description = initialData ? 'Editer le size' : "Crée le nouveau size"
    const toastMessage = initialData ? 'Size modifié' : "Size crée."
    const action = initialData ? 'billeboard sauvegardé' : "Nouvelle creation"
    

   const form = useForm<SizesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value:''
    }
   })

   const onSubmit = async (data : SizesFormValues) => {
    try {
      setLoading(true)
      if(initialData) {
    
        await axios.patch(`/api/stores/${params.storeId}/sizes/${params.sizeId}`, data )

      } else {
      await axios.post(`/api/stores/${params.storeId}/sizes`, data )

      }
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success("Magasin crée")
      console.log(data)
    } catch(error){
      toast.error(toastMessage)
      console.log(error)
    }finally{
      setLoading(false)
    }
   };

   const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}/sizes/${params.sizeId}` )
            router.refresh()
            router.push(`/${params.storeId}/sizes`);
      toast.success("Size supprimé")
    }catch(error) {
      toast.error("Voulez-vous supprimé ce Size")
    }finally{
      setLoading(false)
      setOpen(false)
    }
   }


  return (
    <>
   <AlertModal
   isOpen={open}
   onClose={() => setOpen(false)}
   onConfirm={onDelete}
   loading={loading}
   />
   
   
    <div className="flex items-center justify-between">
    <Heading
    title={title}
    description={description}
    />
{initialData &&(
    <Button
    disabled={loading}
    variant="destructive"
    size="icon"
    onClick={() =>setOpen(true)}
    >
    <Trash className=" h-4 w-4"/>
    </Button>
    ) }
    </div>
    <Separator/>
    <Form {...form} >
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
    
    
    <div className="grid grid-cols-3 gap-8">
    <FormField
    control={form.control}
    name="name"
    render={({ field }) =>(
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input disabled={loading} placeholder="Size name" {...field}/>
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
    />
     <FormField
    control={form.control}
    name="value"
    render={({ field }) =>(
      <FormItem>
        <FormLabel>Value</FormLabel>
        <FormControl>
          <Input disabled={loading} placeholder="Size value" {...field}/>
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
    />
    </div>
    <Button disabled={loading} className="ml-auto" type="submit"> {action}
      
    </Button>
    </form>
    </Form>
  
    </>
  )
}