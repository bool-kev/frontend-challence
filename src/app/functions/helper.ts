export function extractSlugParams(slug:string){
  const lastIndex=slug.lastIndexOf('-');
  return {
    id:parseInt(slug.substring(lastIndex+1)),
    slug:slug.substring(0,lastIndex)
  };
}