'use client';

import { useState, useTransition } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { addComment } from '@/lib/db/actions/collaboration-actions';
import { toast } from '@/hooks/use-toast';
import { formatRelativeTime } from '@/lib/date-utils';
import { useRouter } from 'next/navigation';

interface CommentSectionProps {
    taskId: string;
    comments: any[]; // Comments with author relation
    currentUserId: string;
    onCommentAdded?: (comment: any) => void; // Callback for immediate UI update
}

export function CommentSection({ taskId, comments, currentUserId, onCommentAdded }: CommentSectionProps) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast({ title: "Digite um comentário", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            const result = await addComment(taskId, currentUserId, content);

            if (result.error) {
                toast({ title: "Erro ao adicionar comentário", variant: "destructive" });
            } else {
                toast({ title: "✅ Comentário adicionado!" });
                setContent('');

                // Call callback if provided for immediate UI update
                if (onCommentAdded && result.comment) {
                    onCommentAdded(result.comment);
                } else {
                    router.refresh();
                }
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Comment List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">Seja o primeiro a comentar!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-primary/10">
                                    {comment.author?.name
                                        ?.split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-semibold text-sm">{comment.author?.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatRelativeTime(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="border-t pt-4">
                <div className="space-y-2">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Adicione um comentário..."
                        className="min-h-[80px] resize-none"
                        disabled={isPending}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending || !content.trim()} className="gap-2">
                            <Send className="w-4 h-4" />
                            {isPending ? 'Enviando...' : 'Comentar'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
