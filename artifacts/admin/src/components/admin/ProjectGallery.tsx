import { useState, useRef, useEffect } from "react";
import { ProjectImage } from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { Button } from "@/components/ui/button";
import { resolveImageUrl } from "@/lib/image-utils";
import { Trash2, GripVertical, Image as ImageIcon, Star, UploadCloud, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalImage extends Partial<ProjectImage> {
  tempId: string;
  imagePath: string;
  isCover: boolean;
  sortOrder: number;
}

interface ProjectGalleryProps {
  initialImages: ProjectImage[];
  initialCover: string;
  onImagesChange: (images: { imagePath: string; sortOrder: number }[]) => void;
  onCoverChange: (path: string) => void;
}

export function ProjectGallery({ initialImages, initialCover, onImagesChange, onCoverChange }: ProjectGalleryProps) {
  const [images, setImages] = useState<LocalImage[]>([]);
  
  useEffect(() => {
    setImages(
      initialImages.map((img, i) => ({
        ...img,
        tempId: img.id || Math.random().toString(36).substring(7),
        isCover: img.imagePath === initialCover,
        sortOrder: img.sortOrder ?? i,
      }))
    );
  }, [initialImages, initialCover]);

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      setImages((prev) => {
        const newImage: LocalImage = {
          tempId: Math.random().toString(36).substring(7),
          imagePath: response.objectPath,
          isCover: prev.length === 0,
          sortOrder: prev.length,
        };
        const next = [...prev, newImage];
        onImagesChange(next.map((img) => ({ imagePath: img.imagePath, sortOrder: img.sortOrder })));
        if (newImage.isCover) {
          onCoverChange(newImage.imagePath);
        }
        return next;
      });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    // We process sequentially to avoid overwhelming the connection, though parallel is possible
    for (const file of files) {
      await uploadFile(file);
    }
    
    // Clear input
    e.target.value = "";
  };

  const removeImage = (tempId: string) => {
    const newImages = images.filter(img => img.tempId !== tempId).map((img, i) => ({ ...img, sortOrder: i }));
    setImages(newImages);
    onImagesChange(newImages.map(img => ({ imagePath: img.imagePath, sortOrder: img.sortOrder })));
    
    // If we removed the cover, set the first available as cover
    const removedImg = images.find(img => img.tempId === tempId);
    if (removedImg?.isCover && newImages.length > 0) {
      const newCoverPath = newImages[0].imagePath;
      newImages[0].isCover = true;
      setImages([...newImages]);
      onCoverChange(newCoverPath);
    } else if (newImages.length === 0) {
      onCoverChange("/placeholder");
    }
  };

  const setCover = (tempId: string) => {
    const newImages = images.map(img => ({
      ...img,
      isCover: img.tempId === tempId
    }));
    setImages(newImages);
    
    const coverImg = newImages.find(img => img.isCover);
    if (coverImg) {
      onCoverChange(coverImg.imagePath);
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= images.length) return;
    
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + direction];
    newImages[index + direction] = temp;
    
    // Update sortOrder
    newImages.forEach((img, i) => {
      img.sortOrder = i;
    });
    
    setImages(newImages);
    onImagesChange(newImages.map(img => ({ imagePath: img.imagePath, sortOrder: img.sortOrder })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display">Imágenes del proyecto</h3>
          <p className="text-sm text-muted-foreground">Sube imágenes, selecciona la portada y ordénalas.</p>
        </div>
        <div className="relative">
          <Input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            disabled={isUploading}
          />
          <Button variant="secondary" className="rounded-none gap-2 pointer-events-none">
            {isUploading ? (
              <span className="animate-pulse flex items-center gap-2">Subiendo...</span>
            ) : (
              <><UploadCloud className="w-4 h-4" /> Agregar imágenes</>
            )}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border border-dashed border-border p-12 flex flex-col items-center justify-center text-center bg-muted/20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground max-w-sm">No hay imágenes en este proyecto. Las imágenes que agregues aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div 
              key={img.tempId}
              className={cn(
                "group relative aspect-square border bg-card transition-all",
                img.isCover ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
              )}
            >
              <img 
                src={resolveImageUrl(img.imagePath)} 
                alt="Project image" 
                className="w-full h-full object-cover"
              />
              
              {img.isCover && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> Portada
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  {!img.isCover && (
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-none" 
                      onClick={() => setCover(img.tempId)}
                      title="Marcar como portada"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 rounded-none" 
                    onClick={() => removeImage(img.tempId)}
                    title="Eliminar imagen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-between gap-1 mt-auto">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-none bg-background/80 hover:bg-background" 
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-none bg-background/80 hover:bg-background" 
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Dummy input component specifically for this file
function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
