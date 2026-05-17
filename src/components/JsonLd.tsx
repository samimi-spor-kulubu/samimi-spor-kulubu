type JsonLdProps = {
  /** Stable id, so React can dedupe if the same schema is rendered twice. */
  id?: string;
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Renders one or more JSON-LD blocks. Strips undefined keys before
 * serializing so the resulting markup stays small and tidy.
 */
export function JsonLd({id, data}: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{__html: JSON.stringify(data, replacer)}}
    />
  );
}

function replacer(_key: string, value: unknown) {
  return value === undefined ? undefined : value;
}
