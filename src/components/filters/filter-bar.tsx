'use client';

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
    value: string;
    label: string;
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
    className = ""
}: FilterBarProps) {
    const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filtros:</span>
            </div>

            {/* Status Filter */}
            <Select
                value={filters.status || 'all'}
                onValueChange={(value) => onFilterChange('status', value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Priority Filter */}
            {priorityOptions && (
                <Select
                    value={filters.priority || 'all'}
                    onValueChange={(value) => onFilterChange('priority', value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                        {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Assignee Filter */}
            {assigneeOptions && assigneeOptions.length > 0 && (
                <Select
                    value={filters.assignee || 'all'}
                    onValueChange={(value) => onFilterChange('assignee', value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Responsável" />
                    </SelectTrigger>
                    <SelectContent>
                        {assigneeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="gap-2"
                >
                    <X className="h-4 w-4" />
                    Limpar
                    <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                    </Badge>
                </Button>
            )}
        </div>
    );
}
