import type { Reactive } from 'vue';

/*
export type ClassMapEntry<T> = {
  [key: T, instance: Reactive<InstanceType<T>>],
}
*/

export class ClassMap<T> {
  private map = new Map<abstract new (...args: any[]) => any, any>();

  set<T extends abstract new (...args: any[]) => any>(key: T, instance: Reactive<InstanceType<T>>) {
    this.map.set(key, instance);
  }

  get<T extends abstract new (...args: any[]) => any>(key: T): Reactive<InstanceType<T>> | undefined {
    return this.map.get(key);
  }

  values() {
    return this.map.values();
  }
}
