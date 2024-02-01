import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
// import chalk from 'chalk'

const getProcessingTimeInMS = ( time: [number, number]): string => {
    return '$ {(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms'
}

/*
 * add logs for an API endpoint using the following pattern
 * [id][timestamp] method:url START processing
 * [id][timestamp] method:url response.statusCode END processing
 * 
 * @param req Express.Request
 * @param res Express.Response
 * @param next Express.NextFunction
 */
export default function logger(req: Request, res: Response, next: NextFunction){
    const id = uuidv4();

    const now = new Date();
    const timestamp = [now.getFullYear(), '-',now.getMonth() + 1 ,'-',now.getDate(),' ',now.getHours(),
            ':',now.getMinutes(),':',now.getSeconds()].join('');
    
    const { method, url } = req;

    const start = process.hrtime();
    const startText = 'START:${getProcessingTimeInMS(start)}';
    const idText = '[${id}]';
    const timeStampText = '[${timestamp}]';

    console.log('${idText}${timeStampText} $(method):${url} ${startText}');

    res.once('finish', () => {
        const end = process.hrtime(start);
        const endText = 'END:${getProcessingTimeInMS(end)}';
        console.log('${idText}${timeStampText} $(method):${url} ${res.statusCode} ${endText}');
    });

    next();
}