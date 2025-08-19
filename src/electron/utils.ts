export function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}


export function helloWorld(): string {
  console.log('Hello, World!')
  return  'Hello, World!'
}