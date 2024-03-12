'use client'

import {useEffect, useRef, useState} from "react";

export default function AnalogInputText(props: {text: string}) {

    const {text} = props

    const [value, setValue] = useState("")

    const indexRef = useRef(-1)

    function renderText() {

        const index = indexRef.current

        if (index < text.length) {
            setValue(pre => pre+ text.charAt(index))
            indexRef.current++;

            // 设置一个延迟，控制打字的速度
            setTimeout(renderText, 100); // 这里的100是打字速度，可以根据需要调整
        }
    }

    useEffect(() => {

        renderText();

    }, [])

    return <span>{value}</span>
}