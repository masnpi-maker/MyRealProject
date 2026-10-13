export function Loading(){return <div className="state" role="status">Įkeliama…</div>}
export function ErrorState({message,onRetry}){return <div className="alert" role="alert">{message}<button className="button ghost" onClick={onRetry}>Bandyti dar kartą</button></div>}
