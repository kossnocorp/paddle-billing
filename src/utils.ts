export namespace PaddleUtils {
  /**
   * Make all properties in the type optional
   */
  export type Optional<Type> = {
    [Key in keyof Type]?: Type[Key] | undefined;
  };

  /**
   * Makes the specified fields optional.
   */
  export type MakeFieldsOptional<Type, Keys extends keyof Type> = Omit<
    Type,
    Keys
  > &
    Optional<Pick<Type, Keys>>;

  /**
   * Lists keys that extend null.
   */
  type NullableKeys<Type> = {
    [Key in keyof Type]: null extends Type[Key] ? Key : never;
  }[keyof Type];

  /**
   * Makes nullable fields optional
   */
  export type MakeNullableFieldsOptional<Type> = MakeFieldsOptional<
    Type,
    NullableKeys<Type>
  >;

  //// Snake to camel case, source: https://stackoverflow.com/a/65642944/75284

  /**
   * Converts string from snake_case to camelCase.
   */
  export type SnakeToCamelCase<Str extends string> =
    Str extends `${infer Head}_${infer Tail}`
      ? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
      : Str;

  /**
   * Converts object keys from snake_case to camelCase.
   */
  export type DeepSnakeToCamelCase<Type> = Type extends object
    ? {
        [Key in keyof Type as SnakeToCamelCase<
          Key & string
        >]: DeepSnakeToCamelCase<Type[Key]>;
      }
    : Type;

  /**
   * Extracts only required keys from an object.
   */
  export type RequiredKeys<Type> = {
    [Key in keyof Type]-?: {} extends Pick<Type, Key> ? never : Key;
  }[keyof Type];

  /**
   * Infers true if passed set of keys are equal.
   */
  export type EqualKeys<KeysA, KeysB> = [KeysA] extends [KeysB]
    ? [KeysB] extends [KeysA]
      ? true
      : false
    : false;
}
