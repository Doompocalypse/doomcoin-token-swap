import { ScrollArea } from "@/components/ui/scroll-area";

interface DescriptionProps {
  description: string | null;
}

const Description = ({ description }: DescriptionProps) => {
  const formatDescription = (text: string | null): string[] => {
    if (!text) return [];
    
    const cleanText = text
      .replace(/\\n/g, '\n')
      .replace(/\/n/g, '\n');
    
    return cleanText.split('\n').filter(line => line.trim());
  };

  const paragraphs = formatDescription(description);

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-[120px] pr-4">
        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            className={`text-gray-300 text-sm ${
              paragraph.startsWith('•') ? 'pl-4' : ''
            } ${index < paragraphs.length - 1 ? 'mb-2' : ''}`}
          >
            {paragraph}
          </p>
        ))}
      </ScrollArea>
    </div>
  );
};

export default Description;