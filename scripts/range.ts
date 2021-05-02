export default function range(from: number, to: number): Array<number> {
  const list = [];
  for (let index = from; index < to; index++) {
    list.push(index);
  }

  return list;
}
