"use client"

import { Search, XIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { beerStyleTemplates, type BeerStyleTemplate } from "@/lib/templates"

type TemplateDialogProps = {
  open: boolean
  onOpenChange: (_open: boolean) => void
  onSelectTemplate: (_template: BeerStyleTemplate) => void
  onStartFromScratch: () => void
}

const FAMILY_LABELS = {
  ale: "Ale",
  lager: "Lager",
  stout: "Stout",
  "mixed-fermentation": "Mixed Ferm",
  other: "Specialty & Other",
} satisfies Record<BeerStyleTemplate["styleFamily"], string>

const templateList = Object.values(beerStyleTemplates).sort((a, b) =>
  a.name.localeCompare(b.name),
)

export function TemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate,
  onStartFromScratch,
}: TemplateDialogProps) {
  const familyOptions = useMemo(() => {
    const ORDER = {
      ale: 0,
      lager: 1,
      stout: 2,
      "mixed-fermentation": 3,
      other: 4,
    }
    return Array.from(
      new Set<BeerStyleTemplate["styleFamily"]>(
        templateList.map((template) => template.styleFamily),
      ),
    ).sort((a, b) => ORDER[a] - ORDER[b])
  }, [])

  const [selectedFamilies, setSelectedFamilies] = useState<
    BeerStyleTemplate["styleFamily"][]
  >([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (selectedFamilies.length === 0 && familyOptions.length > 0) {
      setSelectedFamilies(familyOptions)
    }
  }, [familyOptions, selectedFamilies.length])

  useEffect(() => {
    if (!open) {
      setSearchTerm("")
    }
  }, [open])

  const filteredTemplates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return templateList.filter((template) => {
      if (!selectedFamilies.includes(template.styleFamily)) {
        return false
      }

      if (!term) {
        return true
      }

      const haystack = [
        template.name,
        template.description,
        template.bjcp?.category,
        template.bjcp?.code,
        template.sensoryProfile.aroma,
        template.sensoryProfile.flavor,
        template.sensoryProfile.mouthfeel,
        template.sensoryProfile.appearance,
        ...template.keyIngredients.baseMalts.map((item) => item.name),
        ...template.keyIngredients.hops.map((item) => item.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return haystack.includes(term)
    })
  }, [searchTerm, selectedFamilies])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden p-0 max-w-[min(800px,calc(100%-2rem))] sm:max-w-[800px]"
      >
        <div className="flex h-[680px] flex-col">
          <DialogHeader className="border-b px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-lg font-semibold">
                Templates
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close templates"
                >
                  <XIcon className="size-4" />
                </Button>
              </DialogClose>
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
                    const isChecked = selectedFamilies.includes(family)
                    const label =
                      FAMILY_LABELS[family as keyof typeof FAMILY_LABELS] ??
                      family

                    return (
                      <label
                        key={family}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            setSelectedFamilies((previous) => {
                              const next = new Set(previous)
                              const on = Boolean(checked)
                              if (on) {
                                next.add(family)
                              } else {
                                next.delete(family)
                                if (next.size === 0) {
                                  return previous // prevent zero selections
                                }
                              }
                              return Array.from(next)
                            })
                          }}
                          aria-label={label}
                        />
                        <span className="select-none text-foreground">
                          {label}
                        </span>
                      </label>
                    )
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
                        {
                          FAMILY_LABELS[
                            template.styleFamily as keyof typeof FAMILY_LABELS
                          ]
                        }
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <DialogFooter className="flex items-center justify-between border-t px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => {
                onStartFromScratch()
                onOpenChange(false)
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
  )
}

TemplateDialog.displayName = "TemplateDialog"
