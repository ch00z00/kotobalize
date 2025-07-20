import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  // JestのFake Timersを有効にする
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const timeLimitInSeconds = 300; // 5 minutes

  it('ケース1: 初期状態が正しいこと', () => {
    const { result } = renderHook(() => useTimer({ timeLimitInSeconds }));

    expect(result.current.timerState).toBe('idle');
    expect(result.current.elapsedSeconds).toBe(0);
    expect(result.current.remainingSeconds).toBe(timeLimitInSeconds);
    expect(result.current.formattedTime).toBe('05:00');
  });

  it('ケース2: start()でタイマーが開始され、1秒ごとに時間が更新されること', () => {
    const { result } = renderHook(() => useTimer({ timeLimitInSeconds }));

    act(() => {
      result.current.start();
    });

    expect(result.current.timerState).toBe('running');

    // 1秒進める
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedSeconds).toBe(1);
    expect(result.current.remainingSeconds).toBe(timeLimitInSeconds - 1);
    expect(result.current.formattedTime).toBe('04:59');

    // さらに2秒進める
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.elapsedSeconds).toBe(3);
    expect(result.current.formattedTime).toBe('04:57');
  });

  it('ケース3: pause()でタイマーが一時停止し、時間が進まないこと', () => {
    const { result } = renderHook(() => useTimer({ timeLimitInSeconds }));

    act(() => {
      result.current.start();
    });
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.elapsedSeconds).toBe(5);

    act(() => {
      result.current.pause();
    });

    expect(result.current.timerState).toBe('paused');

    // 時間を進めてもelapsedSecondsが変わらないことを確認
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.elapsedSeconds).toBe(5);
  });

  it('ケース4: resume()でタイマーが再開されること', () => {
    const { result } = renderHook(() => useTimer({ timeLimitInSeconds }));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(5000));
    act(() => result.current.pause());
    act(() => result.current.resume());

    expect(result.current.timerState).toBe('running');

    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.elapsedSeconds).toBe(6);
  });

  it('ケース5: reset()でタイマーが初期状態に戻ること', () => {
    const { result } = renderHook(() => useTimer({ timeLimitInSeconds }));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(10000));
    act(() => result.current.reset());

    expect(result.current.timerState).toBe('idle');
    expect(result.current.elapsedSeconds).toBe(0);
    expect(result.current.remainingSeconds).toBe(timeLimitInSeconds);
    expect(result.current.formattedTime).toBe('05:00');
  });

  it('ケース6: 時間切れでタイマーがfinished状態になること', () => {
    const { result } = renderHook(() => useTimer({ timeLimitInSeconds }));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(timeLimitInSeconds * 1000));

    expect(result.current.timerState).toBe('finished');
    expect(result.current.elapsedSeconds).toBe(timeLimitInSeconds);
    expect(result.current.remainingSeconds).toBe(0);

    // さらに時間を進めてもelapsedSecondsが変わらないことを確認
    act(() => jest.advanceTimersByTime(5000));
    expect(result.current.elapsedSeconds).toBe(timeLimitInSeconds);
  });

  it('ケース7: アンマウント時にタイマーがクリアされること', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { result, unmount } = renderHook(() =>
      useTimer({ timeLimitInSeconds })
    );

    act(() => result.current.start());
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });
});
