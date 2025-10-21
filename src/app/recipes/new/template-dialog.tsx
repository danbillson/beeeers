"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { beerStyleTemplates, type BeerStyleTemplate } from "@/lib/templates";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type TemplateDialogProps = {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  onSelectTemplate: (_template: BeerStyleTemplate) => void;
  onStartFromScratch: () => void;
};

const FAMILY_LABELS: Record<BeerStyleTemplate["styleFamily"], string> = {
  ale: "Ale",
  lager: "Lager",
  "mixed-fermentation": "Mixed Fermentation",
  other: "Specialty & Other",
};

const templateList = Object.values(beerStyleTemplates).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export function TemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate,
  onStartFromScratch,
}: TemplateDialogProps) {
  const familyOptions = useMemo(
    () =>
      Array.from(
        new Set<BeerStyleTemplate["styleFamily"]>(
          templateList.map((template) => template.styleFamily)
        )
      ),
    []
  );

  const [selectedFamilies, setSelectedFamilies] = useState<
    BeerStyleTemplate["styleFamily"][]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedFamilies.length === 0 && familyOptions.length > 0) {
      setSelectedFamilies(familyOptions);
    }
  }, [familyOptions, selectedFamilies.length]);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  const filteredTemplates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return templateList.filter((template) => {
      if (!selectedFamilies.includes(template.styleFamily)) {
        return false;
      }

      if (!term) {
        return true;
      }

      const haystack = [
        template.name,
        template.description,
        template.bjcp?.category,
        template.bjcp?.code,
        ...(template.aliases ?? []),
        template.sensoryProfile.aroma,
        template.sensoryProfile.flavor,
        template.sensoryProfile.mouthfeel,
        template.sensoryProfile.appearance,
        ...template.keyIngredients.baseMalts.map((item) => item.name),
        ...template.keyIngredients.hops.map((item) => item.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [searchTerm, selectedFamilies]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-[min(800px,calc(100%-2rem))] sm:max-w-[800px]">
        <div className="flex h-[680px] flex-col">
          <DialogHeader className="border-b px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <DialogTitle className="text-xl font-semibold">
                  Templates
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            <aside className="hidden w-56 shrink-0 border-r lg:flex lg:flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-1 p-4">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Styles
                    </p>
                  </div>
                  {familyOptions.map((family) => {
                    const isActive = selectedFamilies.includes(family);
                    const label =
                      FAMILY_LABELS[family as keyof typeof FAMILY_LABELS] ??
                      family;

                    return (
                      <Button
                        key={family}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start font-normal ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => {
                          setSelectedFamilies((previous) => {
                            if (previous.includes(family)) {
                              const next = previous.filter(
                                (item) => item !== family
                              );
                              return next.length > 0 ? next : previous;
                            }

                            return [...previous, family];
                          });
                        }}
                      >
                        {isActive && (
                          <span className="mr-2 text-primary">✓</span>
                        )}
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </aside>

            <section className="flex flex-1 flex-col overflow-hidden">
              <div className="relative border-b ">
                <InputGroup className="w-full rounded-none border-0 shadow-none">
                  <InputGroupInput
                    placeholder="Search for templates, styles, ingredients..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <InputGroupAddon>
                    <Search className="size-4" />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="space-y-3 p-6 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group relative w-full flex flex-col gap-3 rounded-lg border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-foreground">
                          {template.name}
                        </h3>
                        {template.bjcp && (
                          <p className="text-xs text-muted-foreground">
                            BJCP {template.bjcp.code}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {template.styleFamily === "ale"
                          ? "Ale"
                          : template.styleFamily === "lager"
                          ? "Lager"
                          : template.styleFamily === "mixed-fermentation"
                          ? "Mixed"
                          : "Other"}
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {template.description}
                    </p>

                    {template.aliases && template.aliases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {template.aliases.slice(0, 3).map((alias) => (
                          <Badge
                            key={alias}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {alias}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <DialogFooter className="flex items-center justify-between border-t px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => {
                onStartFromScratch();
                onOpenChange(false);
              }}
            >
              Start from scratch
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

TemplateDialog.displayName = "TemplateDialog";
