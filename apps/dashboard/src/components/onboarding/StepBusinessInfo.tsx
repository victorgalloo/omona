'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface BusinessInfo {
  business_name: string;
  business_description: string;
  industry: string;
  target_audience: string;
}

interface StepBusinessInfoProps {
  initialData?: Partial<BusinessInfo>;
  onComplete: (data: BusinessInfo) => void;
}

const industries = [
  'Tecnología',
  'E-commerce',
  'Servicios profesionales',
  'Salud',
  'Educación',
  'Inmobiliaria',
  'Restaurantes / Alimentos',
  'Automotriz',
  'Finanzas',
  'Marketing / Publicidad',
  'Manufactura',
  'Otro',
];

export function StepBusinessInfo({ initialData, onComplete }: StepBusinessInfoProps) {
  const [form, setForm] = useState<BusinessInfo>({
    business_name: initialData?.business_name ?? '',
    business_description: initialData?.business_description ?? '',
    industry: initialData?.industry ?? '',
    target_audience: initialData?.target_audience ?? '',
  });

  const isValid = form.business_name.trim().length > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10">
        <Building2 className="h-8 w-8 text-accent-green" />
      </div>

      <h2 className="mb-2 text-2xl font-semibold text-foreground">Tu negocio</h2>
      <p className="mb-8 text-center text-sm text-muted">
        Cuéntanos sobre tu negocio para personalizar tu agente de ventas
      </p>

      <div className="w-full max-w-md space-y-4">
        <div>
          <Label htmlFor="name">Nombre del negocio *</Label>
          <Input
            id="name"
            value={form.business_name}
            onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
            placeholder="ej. Mi Tienda Online"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="desc">Descripción</Label>
          <Textarea
            id="desc"
            value={form.business_description}
            onChange={(e) => setForm((f) => ({ ...f, business_description: e.target.value }))}
            placeholder="¿Qué hace tu negocio? ¿Qué vendes o qué servicios ofreces?"
            className="mt-1.5"
            rows={3}
          />
        </div>

        <div>
          <Label>Industria</Label>
          <Select
            value={form.industry}
            onValueChange={(v) => setForm((f) => ({ ...f, industry: v }))}
            placeholder="Selecciona una industria"
          >
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="audience">Público objetivo</Label>
          <Input
            id="audience"
            value={form.target_audience}
            onChange={(e) => setForm((f) => ({ ...f, target_audience: e.target.value }))}
            placeholder="ej. PyMEs en México, profesionistas 25-45 años"
            className="mt-1.5"
          />
        </div>

        <Button
          onClick={() => onComplete(form)}
          disabled={!isValid}
          className="mt-6 w-full"
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
