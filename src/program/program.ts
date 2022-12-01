type Program = {
  id: number,
  name: string,
  fee: number
}

let createProgram = (id: number, name: string, fee: number): Program => {
  return {id: id, name: name, fee: fee}
}

export { Program, createProgram }