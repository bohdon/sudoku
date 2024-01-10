import { NetState } from "../utils/types";

interface NetStatusProps {
  state: NetState;
}

const stateClasses = {
  // state: string
};

export default function NetStatus({ state }: NetStatusProps) {
  const stateClass = state;
  return (
    <>
      <div className="box">
        <span className="net-status badge">{state}</span>
      </div>
    </>
  );
}
