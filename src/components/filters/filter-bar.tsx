'use client';

import { Filter, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface FilterOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface FilterBarProps {
    filters: {
        status?: string;
        priority?: string;
        assignee?: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
    statusOptions?: FilterOption[];
    priorityOptions?: FilterOption[];
    assigneeOptions?: FilterOption[];
    showPriority?: boolean;
    showAssignee?: boolean;
    className?: string;
}

const defaultStatusOptions: FilterOption[] = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'PLANNING', label: 'Planejamento' },
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'ON_HOLD', label: 'Em Espera' },
    { value: 'COMPLETED', label: 'Concluído' },
    { value: 'CANCELLED', label: 'Cancelado' },
];

const defaultPriorityOptions: FilterOption[] = [
    { value: 'all', label: 'Todas as Prioridades' },
    { value: 'CRITICAL', label: 'Crítica' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'MEDIUM', label: 'Média' },
    { value: 'LOW', label: 'Baixa' },
];

export function FilterBar({
    filters,
    onFilterChange,
    onClearFilters,
    statusOptions = defaultStatusOptions,
    priorityOptions = defaultPriorityOptions,
    assigneeOptions,
    showPriority = true,
    showAssignee = true,
    className = ""
}: FilterBarProps) {
    const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Filter className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Filtros</h3>
                            <p className="text-xs text-muted-foreground">
                                {activeFiltersCount > 0
                                    ? `${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} ativo${activeFiltersCount > 1 ? 's' : ''}`
                                    : 'Nenhum filtro aplicado'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Limpar Filtros
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Status
                        </label>
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => onFilterChange('status', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            {option.value !== 'all' && (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority Filter */}
                    {showPriority && (
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Prioridade
                            </label>
                            <Select
                                value={filters.priority || 'all'}
                                onValueChange={(value) => onFilterChange('priority', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                {option.value !== 'all' && (
                                                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                                )}
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Assignee Filter */}
                    {showAssignee && assigneeOptions && assigneeOptions.length > 0 && (
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Responsável
                            </label>
                            <Select
                                value={filters.assignee || 'all'}
                                onValueChange={(value) => onFilterChange('assignee', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o responsável" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assigneeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
