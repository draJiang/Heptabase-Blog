import { useState, useCallback, useEffect } from "react";

const useHash = () => {
    const [hash, setHash] = useState(() => window.location.hash);

    // 当hash发生变化时
    const handleChangeEvent = useCallback(() => {
        setHash(window.location.hash);
    }, []);

    useEffect(() => {
        // 监听 hashchange ，当 hash 发生变化时执行
        window.addEventListener("hashchange", handleChangeEvent);
        // 组件卸载时将监听事件进行移除
        return () => {
            window.removeEventListener("hashchange", handleChangeEvent);
        };
    }, []);

    // 更新 hash
    const updateHash = useCallback(
        (newHash) => {
            // 只有当新输入的 hash 跟原有的 hanh 不一致时才进行更新
            if (newHash !== hash) {
                window.location.hash = newHash;
            }
        }, [hash]
    );

    // 将当前的 hash 和 updateHash 暴露出去给外面进行使用
    return [hash, updateHash];
};

export default useHash;