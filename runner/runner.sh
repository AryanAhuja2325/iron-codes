#!/bin/bash

cd /app || exit 1
rm -f output.txt runtime_error.txt compile_error.txt out_clean.txt exp_clean.txt

compile_error=0

start_time=$(date +%s%3N)

# Compile
if [ "$LANG" = "cpp" ]; then
  g++ code.cpp -O2 -o code.out 2> compile_error.txt || compile_error=1
elif [ "$LANG" = "python" ]; then
  :
elif [ "$LANG" = "java" ]; then
  javac Main.java 2> compile_error.txt || compile_error=1
fi

# Compile Error
if [ $compile_error -eq 1 ]; then
  echo "VERDICT: CE"
  exit 0
fi

# Run test cases
for input_file in tests/input*.txt; do

  test_num=$(basename "$input_file" | sed 's/input//;s/.txt//')
  expected_file="tests/output${test_num}.txt"

  run_error=0

  if [ "$LANG" = "cpp" ]; then
    timeout ${TIME_LIMIT}s ./code.out < "$input_file" > output.txt 2> runtime_error.txt || run_error=$?
  elif [ "$LANG" = "python" ]; then
    timeout ${TIME_LIMIT}s python3 code.py < "$input_file" > output.txt 2> runtime_error.txt || run_error=$?
  elif [ "$LANG" = "java" ]; then
    timeout ${TIME_LIMIT}s java Main < "$input_file" > output.txt 2> runtime_error.txt || run_error=$?
  fi

  # TLE
  if [ $run_error -eq 124 ]; then
    echo "VERDICT: TLE"
    echo "FAILED_TEST: $test_num"
    exit 0
  fi

  # Runtime Error
  if [ $run_error -ne 0 ]; then
    echo "VERDICT: RE"
    echo "FAILED_TEST: $test_num"
    exit 0
  fi

  # Normalize output
  tr -d '\r' < output.txt | sed 's/[[:space:]]*$//' > out_clean.txt
  tr -d '\r' < "$expected_file" | sed 's/[[:space:]]*$//' > exp_clean.txt

  # Wrong Answer
  if ! diff -q out_clean.txt exp_clean.txt > /dev/null; then
    echo "VERDICT: WA"
    echo "FAILED_TEST: $test_num"
    exit 0
  fi

done

# Accepted
end_time=$(date +%s%3N)
execution_time=$((end_time - start_time))

echo "VERDICT: AC"
echo "TIME: $execution_time"
echo "MEMORY: 0"