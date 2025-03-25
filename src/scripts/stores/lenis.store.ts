import Alpine from "alpinejs";

const name = "lenis";

const store = {
  instance: null,
};

Alpine.store(name, store);

declare module "alpinejs" {
  interface Stores {
    [name]: typeof store;
  }
}
