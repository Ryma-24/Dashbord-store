"use client"


import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./button";


interface ImageUploadProps {
 disabled?: boolean;
 onChange: (Value: string) => void;
 onRemove: (value: string)=> void
 value: string[]
}


const ImageUpload: React.FC<ImageUploadProps> = ({
 disabled,
 onChange,
 onRemove,
 value
})=> {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() =>{
    setIsMounted(true)
  },[]);

  const onUpload = (result: any) => {
    console.log('Upload result:', result); // Log complet de result
    if (result.info) {
      console.log('Upload info:', result.info); // Log complet de result.info
      if (result.info.secure_url) {
        onChange(result.info.secure_url);
      } else {
        console.error("secure_url is missing in result.info");
      }
    } else {
      console.error("result.info is missing");
    }
  };


  if(!isMounted){
    return null;
  }


  return (
<div>
<div className="mb-4 items-center gap-4">
     {value.map((url) => (
      <div 
      key={url}
      className="relative w-[200px] h-[200px] rounded-md overflow-hidden "
      >
        <div className="z-10 absolute top-2 right-2">
          <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
            <Trash className="h-4 w-4"/>
          </Button>
         </div>
      <Image
      fill
      className="object-cover"
      alt="image"
      src={url}
      />

      </div>
     ))}
    </div>
 <CldUploadWidget onSuccess={onUpload} uploadPreset="sgasjjna">
  {({open}) => {
    const onClick = () => {
      open();
    }
  
  
  return (
    <Button
    type="button"
    disabled={disabled}
    variant="secondary"
    onClick={onClick}>
      <ImagePlus className="h-4 w-4 mr-2"/>
      Telecharger des images
    </Button>
  )
}}
</CldUploadWidget>

    </div>
  )
}

export default ImageUpload