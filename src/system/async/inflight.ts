export class InflightGate {
  private token = 0;

  next(): { isCurrent: () => boolean } {
    const current = ++this.token;
    return {
      isCurrent: () => current === this.token
    };
  }

  invalidateAll(): void {
    this.token++;
  }
}
