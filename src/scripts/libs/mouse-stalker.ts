function mouseStalker({
  stage,
  dampingFactor = 0.05,
  onUpdate,
  onEnter,
  onLeave,
  updatePointManually = false,
}: {
  stage: HTMLElement;
  dampingFactor?: number;
  onUpdate?: (data: {
    dx: number;
    dy: number;
    x: number;
    y: number;
    angle: number;
    squeeze: number;
  }) => void;
  onEnter?: (data: { x: number; y: number }) => void;
  onLeave?: (data: { x: number; y: number }) => void;
  updatePointManually?: boolean;
}) {
  const IS_TOUCH_DEVICE = navigator.maxTouchPoints || 'ontouchstart' in document.documentElement;

  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = 0;
  let requestId = 0;

  // private
  // ------------------------------
  function getAngle(_x: number, _y: number) {
    return (180 * Math.atan2(_y, _x)) / Math.PI;
  }

  function getSqueeze(_x: number, _y: number) {
    const squeeze = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));
    return Math.min(squeeze * 0.001, 0.55);
  }

  function _updatePoint(_x: number, _y: number) {
    x = _x;
    y = _y;
  }

  function _mouseMove(e: MouseEvent) {
    _updatePoint(e.x, e.y);
  }

  function _render() {
    const ROUND_POS = {
      x: Math.round(x - dx),
      y: Math.round(y - dy),
    };

    dx += ROUND_POS.x * dampingFactor;
    dy += ROUND_POS.y * dampingFactor;

    const angle = getAngle(ROUND_POS.x, ROUND_POS.y);
    const squeeze = getSqueeze(ROUND_POS.x, ROUND_POS.y);

    onUpdate &&
      onUpdate({
        dx,
        dy,
        x,
        y,
        angle,
        squeeze,
      });

    if (requestId) cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(_render);
  }

  // public
  // ------------------------------
  const updateMouseMoving = (_x: number, _y: number, _dampingFactor: number) => {
    dampingFactor = _dampingFactor;
    _updatePoint(_x, _y);
  };

  const start = () => {
    if (IS_TOUCH_DEVICE) {
      return;
    }
    requestId = requestAnimationFrame(_render);
  };

  const stop = () => {
    if (IS_TOUCH_DEVICE) {
      return;
    }
    if (requestId) cancelAnimationFrame(requestId);
  };

  const io = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry?.isIntersecting) {
      start();
    } else {
      stop();
    }
  });

  function _mouseEnter(e: MouseEvent) {
    onEnter && onEnter({ x: e.x, y: e.y });
  }
  function _mouseLeave(e: MouseEvent) {
    onLeave && onLeave({ x: e.x, y: e.y });
  }

  const mount = () => {
    if (IS_TOUCH_DEVICE) {
      return;
    }

    if (!updatePointManually) {
      stage.addEventListener('mousemove', _mouseMove);
    }

    stage.addEventListener('mouseenter', _mouseEnter);
    stage.addEventListener('mouseleave', _mouseLeave);

    io.observe(stage);
  };

  const dismount = () => {
    if (IS_TOUCH_DEVICE) {
      return;
    }

    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    stop();

    if (!updatePointManually) {
      stage.removeEventListener('mousemove', _mouseMove);
    }

    stage.removeEventListener('mouseenter', _mouseEnter);
    stage.removeEventListener('mouseleave', _mouseLeave);

    io.disconnect();
  };

  return {
    start,
    stop,
    mount,
    dismount,
    updateMouseMoving,
  };
}

export default mouseStalker;
