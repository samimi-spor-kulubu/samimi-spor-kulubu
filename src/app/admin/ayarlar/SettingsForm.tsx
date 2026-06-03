'use client';

import {useActionState} from 'react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';

import {updateSettings} from './actions';
import {
  SETTINGS_GROUPS,
  type SettingsActionState
} from './constants';

const INITIAL: SettingsActionState = {status: 'idle'};

export function SettingsForm({
  values
}: {
  values: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(updateSettings, INITIAL);

  const showSuccess = state.status === 'success';
  const serverError =
    state.status === 'error' && state.serverError ? state.serverError : null;

  return (
    <form action={formAction} className="space-y-8">
      {showSuccess && (
        <p
          role="status"
          className="rounded-xl border-2 border-brand-yellow bg-brand-yellow/20 px-4 py-3 text-sm font-semibold text-brand-black"
        >
          ✓ Ayarlar kaydedildi.
        </p>
      )}
      {serverError && (
        <p
          role="alert"
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </p>
      )}

      {SETTINGS_GROUPS.map((group) => (
        <section
          key={group.title}
          className="rounded-2xl border-2 border-brand-border bg-white p-5 sm:p-6"
        >
          <header>
            <h2 className="font-heading text-xl tracking-wider text-brand-black">
              {group.title.toLocaleUpperCase('tr-TR')}
            </h2>
            <p className="mt-1 text-sm text-brand-gray">{group.description}</p>
          </header>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
              >
                <Label
                  htmlFor={field.key}
                  className="text-sm font-semibold text-brand-black"
                >
                  {field.label}
                </Label>
                {field.hint && (
                  <p className="mt-0.5 text-xs text-brand-gray">{field.hint}</p>
                )}
                <div className="mt-1.5">
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.key}
                      name={field.key}
                      rows={3}
                      placeholder={field.placeholder}
                      defaultValue={values[field.key] ?? ''}
                    />
                  ) : (
                    <Input
                      id={field.key}
                      name={field.key}
                      type={field.type === 'url' ? 'url' : field.type === 'tel' ? 'tel' : 'text'}
                      placeholder={field.placeholder}
                      defaultValue={values[field.key] ?? ''}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 z-10 -mx-6 flex justify-end border-t border-brand-border bg-brand-surface/95 px-6 py-4 backdrop-blur sm:rounded-b-none">
        <Button type="submit" disabled={pending} size="lg">
          {pending ? 'Kaydediliyor…' : 'Tüm Ayarları Kaydet'}
        </Button>
      </div>
    </form>
  );
}
