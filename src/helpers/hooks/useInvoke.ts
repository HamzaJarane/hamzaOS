export default function useInvoke(next: () => Promise<any>) {
    return (async () => await next())();
}