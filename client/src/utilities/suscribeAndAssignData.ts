import type { Writable } from "svelte/store";

export function subscribeAndAssignData(
    store: Writable<any | null>,
    onDataReceived: (val: any) => void
  ) {
    let data = null;

    const unsubscribe = store.subscribe((val) => {
      if (val) {
        data = val;
        onDataReceived(data);
      }
    });

    return unsubscribe;
  }