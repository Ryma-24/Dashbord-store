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

import { Input } from "@/components/ui/input";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Trash } from "lucide-react";

import { useOrigin } from "@/hook/use-orign";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";


import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-uploaded";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
});

type billboardFormValues = z.infer<typeof formSchema>

interface billboardFormProps {
  initialData: Billboard | null
}


export const BillboardForm:React.FC<billboardFormProps> = ({
  initialData
}) => {

  const params= useParams();
  const router = useRouter();
  const origin = useOrigin();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Editer le billboard' : "Crée le billboard"
    const description = initialData ? 'Editer le billboard' : "Crée le nouveau billboard"
    const toastMessage = initialData ? 'billboard modifié' : "billboard crée."
    const action = initialData ? 'billeboard sauvegardé' : "Nouvelle creation"

    

   const form = useForm<billboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl:''
    }
   })

   const onSubmit = async (data : billboardFormValues) => {
    try {
      setLoading(true)
      if(initialData) {
      await axios.patch(`/api/stores/${params.storeId}/billboards/${params.billboardId}`, data )
      } else {
      await axios.post(`/api/stores/${params.storeId}/billboards`, data )
      }
      router.refresh()
      router.push(`/${params.storeId}billboards`)
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
      await axios.delete(`/api/stores/${params.storeId}/billboards/${params.billboardId}` )
            router.refresh()
            router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard supprimé")
    }catch(error) {
      toast.error("Voulez-vous supprimé ce Billboard")
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
    
    <FormField
    control={form.control}
    name="imageUrl"
    render={({ field }) =>(
      <FormItem>
        <FormLabel>Background image</FormLabel>
        <FormControl>
       <ImageUpload
       value={field.value ? [field.value] : [] }
       disabled={loading}
       onChange={(url) => field.onChange(url)}
       onRemove={() => field.onChange("")}
       />
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
    />
    <div className="grid grid-cols-3 gap-8">
    <FormField
    control={form.control}
    name="label"
    render={({ field }) =>(
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input disabled={loading} placeholder="Billboard label" {...field}/>
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