interface UseLlamaParams {
  onToken?: (message: any) => void;
  onStartInfer?: () => void;
  onEndInfer?: () => void;
  verbose?: boolean;
}

export { UseLlamaParams }