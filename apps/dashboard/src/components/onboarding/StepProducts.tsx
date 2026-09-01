'use client';

import { useState } from 'react';
import { Package, Plus, Trash2, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Product {
  name: string;
  description: string;
  price: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface StepProductsProps {
  onComplete: (data: { products: Product[]; faqs: FAQ[] }) => void;
}

export function StepProducts({ onComplete }: StepProductsProps) {
  const [products, setProducts] = useState<Product[]>([
    { name: '', description: '', price: '' },
  ]);
  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: '', answer: '' },
  ]);

  const addProduct = () => setProducts((p) => [...p, { name: '', description: '', price: '' }]);
  const removeProduct = (i: number) => setProducts((p) => p.filter((_, idx) => idx !== i));
  const updateProduct = (i: number, field: keyof Product, value: string) =>
    setProducts((p) => p.map((prod, idx) => (idx === i ? { ...prod, [field]: value } : prod)));

  const addFaq = () => setFaqs((f) => [...f, { question: '', answer: '' }]);
  const removeFaq = (i: number) => setFaqs((f) => f.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: keyof FAQ, value: string) =>
    setFaqs((f) => f.map((faq, idx) => (idx === i ? { ...faq, [field]: value } : faq)));

  const validProducts = products.filter((p) => p.name.trim());
  const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10">
        <Package className="h-8 w-8 text-accent-green" />
      </div>

      <h2 className="mb-2 text-2xl font-semibold text-foreground">
        Productos y preguntas frecuentes
      </h2>
      <p className="mb-8 text-center text-sm text-muted">
        Agrega tus productos/servicios y preguntas frecuentes para que tu agente pueda responder
      </p>

      <div className="w-full max-w-lg space-y-6">
        {/* Products */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-accent-green" />
            <h3 className="font-medium text-foreground">Productos / Servicios</h3>
          </div>

          <div className="space-y-4">
            {products.map((product, i) => (
              <div key={i} className="border-t border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">
                    Producto {i + 1}
                  </span>
                  {products.length > 1 && (
                    <button
                      onClick={() => removeProduct(i)}
                      className="text-muted hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    value={product.name}
                    onChange={(e) => updateProduct(i, 'name', e.target.value)}
                    placeholder="Nombre del producto"
                    className="h-9 text-sm"
                  />
                  <Textarea
                    value={product.description}
                    onChange={(e) => updateProduct(i, 'description', e.target.value)}
                    placeholder="Descripción breve"
                    rows={2}
                    className="text-sm"
                  />
                  <Input
                    value={product.price}
                    onChange={(e) => updateProduct(i, 'price', e.target.value)}
                    placeholder="Precio (ej. $999 MXN/mes)"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={addProduct} className="mt-3">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Agregar producto
          </Button>
        </div>

        <Separator />

        {/* FAQs */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent-green" />
            <h3 className="font-medium text-foreground">Preguntas frecuentes</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">
                    Pregunta {i + 1}
                  </span>
                  {faqs.length > 1 && (
                    <button
                      onClick={() => removeFaq(i)}
                      className="text-muted hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    value={faq.question}
                    onChange={(e) => updateFaq(i, 'question', e.target.value)}
                    placeholder="¿Cuál es la pregunta?"
                    className="h-9 text-sm"
                  />
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                    placeholder="Respuesta"
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={addFaq} className="mt-3">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Agregar pregunta
          </Button>
        </div>

        <Button
          onClick={() =>
            onComplete({
              products: validProducts,
              faqs: validFaqs,
            })
          }
          className="mt-4 w-full"
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
