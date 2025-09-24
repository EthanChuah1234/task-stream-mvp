import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit3, Save, X } from 'lucide-react';

interface NotesEditorProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function NotesEditor({ notes, onNotesChange, onSave, onCancel }: NotesEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [localNotes, setLocalNotes] = useState(notes);

  const handleSave = () => {
    onNotesChange(localNotes);
    onSave();
  };

  const handleCancel = () => {
    setLocalNotes(notes);
    onCancel?.();
  };

  // Simple markdown-to-HTML converter for preview
  const renderMarkdown = (text: string) => {
    if (!text) return '<p class="text-muted-foreground text-sm">No notes yet. Start writing!</p>';

    return text
      .split('\n')
      .map(line => {
        // Headers
        if (line.startsWith('### ')) {
          return `<h3 class="text-lg font-semibold text-foreground mt-4 mb-2">${line.slice(4)}</h3>`;
        }
        if (line.startsWith('## ')) {
          return `<h2 class="text-xl font-semibold text-foreground mt-4 mb-2">${line.slice(3)}</h2>`;
        }
        if (line.startsWith('# ')) {
          return `<h1 class="text-2xl font-bold text-foreground mt-4 mb-2">${line.slice(2)}</h1>`;
        }
        
        // Code blocks
        if (line.startsWith('```') && line.endsWith('```') && line.length > 6) {
          const code = line.slice(3, -3);
          return `<code class="bg-muted text-muted-foreground px-2 py-1 rounded text-sm font-mono">${code}</code>`;
        }
        
        // Inline code
        line = line.replace(/`([^`]+)`/g, '<code class="bg-muted text-muted-foreground px-1 rounded text-sm font-mono">$1</code>');
        
        // Bold
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
        
        // Italic
        line = line.replace(/\*([^*]+)\*/g, '<em class="italic text-foreground">$1</em>');
        
        // Lists
        if (line.startsWith('- ')) {
          return `<li class="text-foreground ml-4 list-disc">${line.slice(2)}</li>`;
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return `<p class="text-foreground mb-2">${line}</p>`;
        }
        
        return '<br>';
      })
      .join('');
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Edit3 className="w-4 h-4" />
            Task Notes
            <Badge variant="outline" className="text-xs">
              Markdown
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              variant="default"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            {onCancel && (
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-2">
            <Textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Write your notes here... 

You can use Markdown:
# Heading 1
## Heading 2  
### Heading 3

**bold text**
*italic text*
`inline code`

- List item 1
- List item 2

```code blocks```"
              className="min-h-[200px] bg-background border-input font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Supports Markdown formatting: **bold**, *italic*, `code`, # headers, - lists
            </p>
          </TabsContent>
          
          <TabsContent value="preview">
            <div 
              className="min-h-[200px] p-4 bg-background border border-input rounded-md prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(localNotes) }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}