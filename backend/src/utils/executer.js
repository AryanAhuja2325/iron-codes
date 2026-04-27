const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(__dirname, '../../temp');

const executeCode = (code, language, problem, submissionId) => {
    return new Promise((resolve) => {
        const jobId = uuidv4();
        const jobDir = path.join(TEMP_DIR, jobId);

        try {
            fs.mkdirSync(jobDir, { recursive: true });
            fs.mkdirSync(path.join(jobDir, 'tests'), { recursive: true });

            let fileName = '';
            if (language === 'cpp') fileName = 'code.cpp';
            else if (language === 'c') fileName = 'code.c';
            else if (language === 'python') fileName = 'code.py';
            else if (language === 'node') fileName = 'code.js';
            else if (language === 'java') fileName = 'Main.java';

            fs.writeFileSync(path.join(jobDir, fileName), code);

            problem.testCases.forEach((tc, i) => {
                fs.writeFileSync(
                    path.join(jobDir, `tests/input${i}.txt`),
                    tc.input
                );
                fs.writeFileSync(
                    path.join(jobDir, `tests/output${i}.txt`),
                    tc.output
                );
            });

            const timeLimitSec = Math.ceil((problem.timeLimit || 1000) / 1000);

            const command = `
                docker run --rm \
                --memory=256m \
                --cpus=0.5 \
                --pids-limit=64 \
                --network=none \
                -e LANG=${language} \
                -e TIME_LIMIT=${timeLimitSec} \
                -v ${jobDir}:/app \
                runner \
                bash /runner.sh
            `;

            exec(command, { timeout: 15000 }, (error, stdout, stderr) => {

                const output = stdout.toString();
                fs.rmSync(jobDir, { recursive: true, force: true });

                if (error && !stdout) {
                    return resolve({
                        status: 'Error',
                        error: stderr || error.message
                    });
                }

                console.log('Runner Output:\n', output);

                // ✅ simple parser
                const getValue = (key) => {
                    const regex = new RegExp(`${key}:\\s*(.*)`);
                    const match = output.match(regex);
                    return match ? match[1].trim() : null;
                };

                const verdict = getValue('VERDICT');
                const time = getValue('TIME');
                const memory = getValue('MEMORY');
                const failedTest = getValue('FAILED_TEST');

                const statusMap = {
                    AC: 'Accepted',
                    WA: 'Wrong Answer',
                    TLE: 'Time Limit Exceeded',
                    RE: 'Runtime Error',
                    CE: 'Compile Error'
                };

                return resolve({
                    status: statusMap[verdict] || 'Error',
                    time: time ? Number(time) : null,
                    memory: memory ? Number(memory) : null,
                    failedTest: failedTest ? Number(failedTest) : null,
                    error: null
                });
            });

        } catch (err) {
            fs.rmSync(jobDir, { recursive: true, force: true });

            return resolve({
                status: 'Error',
                error: err.message
            });
        }
    });
};

module.exports = { executeCode };