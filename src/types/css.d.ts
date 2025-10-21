// CSS Module declarations for TypeScript
declare module "*.css" {
    const content: Record<string, string>;
    export default content;
}

declare module "*.scss" {
    const content: Record<string, string>;
    export default content;
}

declare module "*.sass" {
    const content: Record<string, string>;
    export default content;
}

// Once UI CSS imports
declare module "@once-ui-system/core/css/styles.css";
declare module "@once-ui-system/core/css/tokens.css";

// Custom CSS imports
declare module "@/resources/custom.css";
