import time
import sys

i = 1
while True:
    print(i)
    sys.stdout.flush()
    i += 1
    time.sleep(1)
